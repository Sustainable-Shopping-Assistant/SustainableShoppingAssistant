/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: String,
    product_image: String,
    product_description: String,
    brand: String,
    carbon_footprint: Number,
    sustainability_score: Number,
    retailer_link: String,
  },
  { collection: "product" }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
