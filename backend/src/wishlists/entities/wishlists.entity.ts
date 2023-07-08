import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/users.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creactedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  owner: User;
}
