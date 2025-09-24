/*
  Warnings:

  - The values [pillow] on the enum `Product_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `category` ENUM('hospital_outfit_special_set', 'hospital_outfit_set', 'toy') NOT NULL;
