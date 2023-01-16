import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub = new Subscription;
  form: FormGroup;

  constructor(fb: FormBuilder, public postsService: PostsService) {
    this.form = fb.group({
      content: [''],
      title: ['']
    });
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  deletePost(post: Post) {
    this.postsService.deletePost(post.id)
  }
  editPost(post: Post) {
    const newPost = {
      content: this.form.get('content')?.value,
      title: this.form.get('title')?.value
    }
    post.content = newPost.content
    post.title = newPost.title
    this.postsService.editPost(post)
    this.form.reset()

  }
}
