# My Blog

This is the GitHub repository for my blog at https://andria.page/

Here I write articles about my thoughts on and experiences with code. I try to write as often as possible but time constraints can make producing new articles difficult.

If you have any ideas or concerns please open an issue or pull request. All contributions are welcome:

- Articles
- Bugs and fixes
- Accessibility fixes/concerns
- Translations

This site was built using Eleventy.

## Contributing

### Setup
You're going to need `volta`. Volta will automatically help you use the correct node and yarn versions. Yarn should also be set to v2 (berry), otherwise some things just won't work (especially on Windows). With all of that out of the way, you need to install the dependencies without changing the lockfile.

```powershell
yarn install --immutable
```

### Running the site
To run the site for development, we'll start up `eleventy` in serve mode with our yarn script.

```powershell
yarn develop
```

To build the site for production, we'll run `eleventy` normally with another yarn script. Make sure to not commit any files created by the build.

```powershell
yarn build
```
