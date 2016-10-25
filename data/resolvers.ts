import lodash from 'lodash';


const authors: Author[] = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
];


const posts: Post[] = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
];


export const resolvers = {
  Query: {
    posts(): Post[] {
      return posts;
    },
  },

  Mutation: {
    upvotePost(_, { postId }) {
      const post = lodash.find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
  },

  Author: {
    posts(author: Author): Post[] {
      return lodash.filter(posts, { authorId: author.id });
    },
  },

  Post: {
    author(post: Post): Author {
      return lodash.find(authors, { id: post.authorId });
    },
  },
};


interface Post {
  id: number;
  authorId: number;
  title: string;
  votes: number;
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}