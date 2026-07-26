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

@Entity('saved_searches')
export class SavedSearch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Geographic bounds (stored as JSON)
  @Column({ type: 'jsonb' })
  bounds!: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  // Filters (stored as JSON)
  @Column({ type: 'jsonb', nullable: true })
  filters?: {
    category?: string[];
    employmentType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
  };

  // Sort preference
  @Column({ default: 'relevance' })
  sortBy!: string;

  // Notification settings
  @Column({ default: false })
  notifyOnNewJobs!: boolean;

  @Column({ default: 'daily' })
  notificationFrequency!: string; // immediate, daily, weekly, disabled

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  lastExecutedAt?: Date;

  @Column({ default: 0 })
  executionCount!: number;
}
