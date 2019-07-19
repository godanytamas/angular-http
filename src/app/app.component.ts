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
  edit = false;
  editedPostId = null;

  constructor(private posts: PostsService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchPosts();
  }

  public onSubmit() {
    if (this.postForm.valid) {
      const post = (this.postForm.value as Post);
      if (this.edit) {
        this.posts.update(this.editedPostId, post)
          .subscribe((res) => {
              this.fetchPosts();
              this.resetForm();
            }
          );
      } else {
        this.posts.add(post)
          .subscribe((res) => {
              this.fetchPosts();
              this.resetForm();
            }
          );
      }
    }
  }

  public onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  public onSearch(query: string) {
    this.fetchPosts(query);
  }

  public onFetchPost(id: string) {
    this.posts.get(id).subscribe(
      (post: Post) => {
        this.postForm.patchValue(post);
        this.editedPostId = id;
        this.edit = true;
      }
    );
  }

  public onDeletePost(id: string) {
    this.posts.delete(id).subscribe(
      () => {
        this.fetchPosts();
      }
    );
  }

  public onClearPosts() {
    // Send Http request
    this.posts.deleteAll()
      .subscribe(() => {
        this.fetchPosts();
      });
  }

  private fetchPosts(query: string = null) {
    this.isFetching = true;
    this.error = null;
    this.posts.getAll(query)
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

  private resetForm() {
    this.postForm.reset();
    this.editedPostId = null;
    this.edit = false;
  }
}
