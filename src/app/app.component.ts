import { Component, OnInit } from '@angular/core';

import {Post} from './post.model';
import {PostsService} from './posts.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  postForm = this.fb.group({
    title: this.fb.control(null, [Validators.required]),
    content: this.fb.control(null, [Validators.required])
  });

  loadedPosts = [];
  isFetching = false;
  error = null;

  constructor(private posts: PostsService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchPosts();
  }

  public onCreatePost() {
    if (this.postForm.valid) {
      const post = (this.postForm.value as Post);
      // Send Http request
      this.posts.add(post)
        .subscribe(response => {
          this.fetchPosts();
          this.postForm.reset();
        });
    }
  }

  public onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  public onClearPosts() {
    // Send Http request
    this.posts.deleteAll()
      .subscribe(() => {
        this.fetchPosts();
      });
  }

  private fetchPosts() {
    this.isFetching = true;
    this.error = null;
    this.posts.getAll()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error => {
          this.error = error;
          console.log(error);
        });
  }
}
