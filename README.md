# Course Evaluations App

### COS Independent Work (Spring 2022)

### Shannon Heh '23, Nicholas Padmanabhan '23

The following commands are done in the root directory.

To run dev server:

```
npm run dev
```

To build app / start server for prod:

```
npm run build
npm run start
```

To install packages for the app:

```
npm ci
```

For formatting, use Prettier with default settings.

To declare environment variables, create a file named `.env.local` in the root directory. See the [docs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) for how to input key-value pairs in this file. To use environment variables in code, call:

```
process.env.<VAR>
```
