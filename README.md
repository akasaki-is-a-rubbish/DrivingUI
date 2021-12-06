# Driving UI

![driving](./res/driving.jpg)

## Install & Run

```shell
npm i
npm run dev
```

## Configuration

Edit `src/config.ts`

## Build MusicCloud

The MusicCloud app bundle is prebuilt and ready to use, so this is not required, unless you want to rebuild it.

```shell
git submodule update --init
cd MusicCloud
pnpm i
pnpm run build
cp bundle.js bundle.js.map ../public/mc/
```
