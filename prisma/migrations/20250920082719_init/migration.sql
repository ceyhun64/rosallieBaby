/*
  Warnings:

  - The values [hospital_outift_set,toy,pillow] on the enum `Product_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `category` ENUM('HOSPITAL_OUTFIT_SET', 'TOY', 'PILLOW') NOT NULL;
