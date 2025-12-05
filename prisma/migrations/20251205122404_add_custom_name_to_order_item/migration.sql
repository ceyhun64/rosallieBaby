-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `customName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `description` TEXT NOT NULL;
