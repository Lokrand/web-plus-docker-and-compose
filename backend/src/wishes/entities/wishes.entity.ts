import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/users.entity';
import { Offer } from 'src/offers/entities/offers.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    scale: 2,
    type: 'decimal',
  })
  price: number;

  @Column({
    scale: 2,
    type: 'decimal',
    default: 0,
  })
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
