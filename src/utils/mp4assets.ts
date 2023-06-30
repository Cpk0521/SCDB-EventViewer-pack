import { ExtensionType, Texture, VideoResource, utils} from "@pixi/core";
// import { Assets } from '@pixi/assets'

export const Mp4Assets = {
    extension: ExtensionType.Asset,
    detection: {
        // TODO: replace this with browser detection
        test: async () => true,
        add: async (formats : string[]) => [...formats, 'mp4'],
        remove: async (formats : string[]) => formats.filter((format: string) => format !== 'mp4'),
    },
    loader: {
        test: (url : string) => utils.path.extname(url) === '.mp4',
        load: async (url : string, asset : any) => {
            let texture : Texture<VideoResource> | any = await Texture.fromURL<VideoResource>(url, asset.data)
            texture.baseTexture.resource.autoPlay = false
            return texture
        },
        unload: async (asset : any) => asset.destroy(true),
    }
}