import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ownerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column({ unique: true })
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  governorate!: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
