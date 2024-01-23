<h1 align='center'>YURT</h1>
<p align='center'>
<img src="https://github.com/nichwch/nomad-hypertext/assets/7423703/501d295c-b5c5-41bc-8fdc-307731439dcc" alt="drawing" width="500"/>
</p>

Yurt is a static site generator, built off the same principles as [Nomad Hypertext](https://github.com/nichwch/nomad-hypertext).  

You can use Yurt to make your own semantically hyperlinked blog! For an example of what that might look like, check out my [blog](https://blog.nicholaschen.io), or an [example instance](https://themediumisthemessage.nicholaschen.io/posts/about.txt) I deployed using the first chapter of Marshall McLuhan's *Understanding Media*.


<p align='center'>
<img src="https://github.com/nichwch/yurt/assets/7423703/ffdcd733-d4dd-4558-9b54-ea41387efabb" alt="drawing" width="500"/>
</p>


## Using Yurt

1. Clone the repo.
2. Run `npm install`.
3. Remove the example posts is `/posts` and replace them with your blog content. Yurt supports Markdown.
4. Run `npm run create-index`. This will use a local first AI model to embed your blog posts, stick them in a vector DB, then create an index of the most related paragraphs to any given paragraph. It can take a while, so don't close it while it's running. In the future I'd like to support using a cloud provider for embeddings to speed things up.
5. Run `npm run dev` to see a preview of your blog.
6. Deploy to Vercel or any other cloud provider that supports SvelteKit.

When you change the contents in posts (adding new posts, updating posts, or deleting posts), you will have to run `npm run create-index` again to update the index. It will only embed newly edited files, but it will have to recreate the entire index, which can take some time.

You can comment paragraphs with // to exclude them from indexing, and use ~ to group together sentences into the same block. See the following image for more details.

<img width="629" alt="tutorial" src="https://github.com/nichwch/yurt/assets/7423703/ac322786-8d67-44ea-be3f-c12fe035128a">

## How it works

When you run `npm run create-index`, yurt embeds all the paragraphs in your notes using [gte-small](https://huggingface.co/Supabase/gte-small) into [OramaSearch](https://oramasearch.com/), which is an in memory vector database. If you've run the indexing script before, it will *only* embed posts that have been added or edited since you last ran the script.

Then, for each paragraph in each post, it finds the 20 most similar paragraphs across all your posts. It generates a static index of these for each post, which is used to show similar ideas when users click a paragraph on your blog.

The index is split by post, so when a post is loaded, only the index for that post is loaded. This is to minimize load time.
## Now Page

You can set one of your posts as a "now page", which you can use to show off the things that are currently top of mind for you. Like all your other posts, clicking on a paragraph here will show related content from all your other posts. This is handy for a now page, because readers can use it as a starting point to find other related content in your blog. It's like a semantic table of contents for your blog. For an example, check out the [now page](https://blog.nicholaschen.io) on my blog.

You can set the now page for your blog by entering the relative path to the post you'd like to use in `config/nowpage.config.txt`. Note that the path is relative to the root, so you must include `/posts` before your post. For an example, see the [now page configuration for my personal blog](https://github.com/nichwch/personal-blog/blob/main/config/nowpage.config.txt).

## Other configuration options

By default, Yurt sets the creation date of each post to the time that it indexed that post. You can overwrite these dates in `config/datefile.config.json`, which is automatically generated when you run `npm run create-index`. This is useful if you are uploading content from another blog, and want to preserve the creation dates of those posts.

You can sort your blog posts using tags. When you run `npm run create-index`, a file called `config/tagfile.config.json` is generated automatically. Its contents are a mapping from each post to an array of tags, which is empty by default. To add a tag to a post, open `config/tagfile.config.json`, find the entry for the post you want to tag, and add tags to its corresponding array. 

`config/lastindexeddate.config.txt` stores the Unix timestamp of the last indexed post, which is used to avoid embedding posts that have already been embedded. `config/indexedfiles.config.json` stores the files that have been previously indexed, so the index creation script can detect when a post has been deleted. You shouldn't touch either of these files unless something's gone wrong.

# Possible optimizations

Right now, it iterates across all paragraphs each time you generate the index. This is because all past content could be related to new content that you generate, so old posts need their indices recreated as well. In theory, yurt could generate an index for newly edited posts, then only reindex posts that have paragraphs that are related to the newly edited posts. This would speed things up significantly, but there is the possibility that there are older posts that are closely related to newly edited posts but not vice versa. In this case, we'd be sacrificing correctness for speed. Here correctness doesn't matter that much, so this would probably be a good tradeoff to make, I just haven't gotten around to implementing it.

It would also be nice to add a way to do this all in the cloud, to speed things up.

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
