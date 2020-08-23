import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import http from "./service/httpService";
import config from "./config.json";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    // pending > resolved (success) OR rejected (failure)
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "Updated title!";
    await http.put(config.apiEndpoint + "/" + post.id, post);
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    const originalPosts = [...this.state.posts];

    const posts = originalPosts.filter((s) => s.id !== post.id);
    this.setState({ posts });

    await http.delete("s" + config.apiEndpoint + "/" + post.id);

    try {
      await http.delete("s" + config.apiEndpoint + "/" + post.id);
      //throw new Error("");
    } catch (ex) {
      // Expected (404: not found, 400: bad request) - CLIENT ERRORs
      //  - Display specific error message
      //
      // Unexpected (network down, server down, db down, bug)
      //  - Log them
      //  - Display generic and friendly error message
      if (ex.response && ex.response.status === 404) {
        Sentry.captureException("Logging the error", ex);
        toast.error("This post has already been deleted.");
      }
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
