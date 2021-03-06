class Meal {
  constructor(
    id,
    categoryId,
    title,
    imgUrl,
    duration,
    ingredients,
    steps,
    isFavorite = false
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.title = title;
    this.imgUrl = imgUrl;
    this.duration = duration;
    this.ingredients = ingredients;
    this.steps = steps;
    this.isFavorite = isFavorite;
  }
}

export default Meal;
