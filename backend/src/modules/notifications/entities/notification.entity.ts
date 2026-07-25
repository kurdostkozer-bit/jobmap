import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  type!: string; // JOB_MATCH, APPLICATION_UPDATE, NEW_COMPANY_JOB, MESSAGE, VERIFICATION

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ nullable: true })
  relatedJobId?: string;

  @Column({ nullable: true })
  relatedApplicationId?: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
