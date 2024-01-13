Yurt is a static site generator, built off the same principles as [Nomad Hypertext](https://github.com/nichwch/nomad-hypertext).  

You can use Yurt to make your own semantically hyperlinked blog! For an example of what that might look like, check out my [blog](https://blog.nicholaschen.io/posts/NOW%20PAGE.txt), or an [example instance](https://themediumisthemessage.nicholaschen.io/posts/about.txt) I deployed using the first chapter of Marshall McLuhan's *Understanding Media*.


<p align='center'>
<img src="https://github.com/nichwch/yurt/assets/7423703/ffdcd733-d4dd-4558-9b54-ea41387efabb" alt="drawing" width="500"/>
</p>


## Using Yurt

1. Clone the repo.
2. Run `npm install`.
3. Remove the example posts is `/posts` and replace them with your blog content.
4. Run `npm run create-index`. This will use a local first AI model to embed your blog posts, stick them in a vector DB, then create an index of the most related paragraphs to any given paragraph. It can take a while, so don't close it while it's running. In the future I'd like to support using a cloud provider for embeddings to speed things up.
5. Run `npm run dev` to see a preview of your blog.
6. Deploy to Vercel or any other cloud provider that supports SvelteKit.

When you change the contents in posts (adding new posts, updating posts, or deleting posts), you will have to run `npm run create-index` again to update the index. It will only embed newly edited files, but it will have to recreate the entire index, which can take some time.

## Now Page

You can set one of your posts as a "now page", which you can use to show off the things that are currently top of mind for you. Like all your other posts, clicking on a paragraph here will show related content from all your other posts. This is handy for a now page, because readers can use it as a starting point to find other related content in your blog. It's like a semantic table of contents for your blog.

You can set the now page for your blog by entering the relative path to the post you'd like to use in `config/nowpage.config.txt`. Note that the path is relative to the root, so you must include `/posts` before your post. For an example, see the [now page configuration for my personal blog](https://github.com/nichwch/personal-blog/blob/main/config/nowpage.config.txt).

## Other configuration options

By default, Yurt sets the creation date of each post to the time that it indexed that post. You can overwrite these dates in `config/datefile.config.json`, which is automatically generated when you run `npm run create-index`. This is useful if you are uploading content from another blog, and want to preserve the creation dates of those posts.

You can sort your blog posts using tags. When you run `npm run create-index`, a file called `config/tagfile.config.json` is generated automatically. Its contents are a mapping from each post to an array of tags, which is empty by default. To add a tag to a post, open `config/tagfile.config.json`, find the entry for the post you want to tag, and add tags to its corresponding array. 

`config/lastindexeddate.config.txt` stores the Unix timestamp of the last indexed post, which is used to avoid embedding posts that have already been embedded. `config/indexedfiles.config.json` stores the files that have been previously indexed, so the index creation script can detect when a post has been deleted. You shouldn't touch either of these files unless something's gone wrong.


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11322972/9e553260-910b-11e5-8de9-a5bf00c352ef.png' height='59px'/></a>
