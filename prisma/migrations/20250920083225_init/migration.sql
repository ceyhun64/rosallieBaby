/*
  Warnings:

  - The values [HOSPITAL_OUTFIT_SET,TOY,PILLOW] on the enum `Product_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `category` ENUM('hospital_outfit_set', 'toy', 'pillow') NOT NULL;
