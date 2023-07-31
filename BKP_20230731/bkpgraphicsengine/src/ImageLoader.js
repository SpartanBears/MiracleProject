class ImageLoader {
    constructor(images=[]) {
        this.imagesURL = images;
        this.images = [];
        this.imagePromises = [];
        this.promisesStates = [];
        this.loading = false;
    }

    addImageURL(url){
        this.imagesURL.push(url);
    }

    async onLoad(customFunction){
		this.loading = true;
        
        for(let imageURL of this.imagesURL){
            this.imagePromises.push(this.loadImage(imageURL));
        }

        this.images = await Promise.all(this.imagePromises);
        if(!!customFunction)	customFunction(this.images);
		
        this.loading = false;
		return this.images;
    }

    loadImage(url){
        return new Promise(resolve => {
            let image = new Image();
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.src = url;
        });
    }
}