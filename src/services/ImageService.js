
export default class ImageService {
    static instance = null;

    /**
     * @returns {ImageService}
     */
    static getInstance() {
        if (ImageService.instance === null) {
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }

    constructor() {
        this.images = {
            icons: {
                list: require('../assets/icons/list.png'),
                plus: require('../assets/icons/plus.png'),
                question: require('../assets/icons/question.png'),
                bin: require('../assets/icons/bin.png'),
            },
            images: {
                logo: require('../assets/PrototimeLogo.png')
            }
        };
    }

    getIcon(name) {
        return this.images.icons[name];
    }

    getImage(name) {
        return this.images.images[name];
    }
}