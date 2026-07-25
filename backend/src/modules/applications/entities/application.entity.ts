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
import { Job } from '../../jobs/entities/job.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  jobId!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @Column({ default: 'APPLIED' })
  status!: string; // APPLIED, REVIEWED, INTERVIEW, OFFERED, REJECTED, WITHDRAWN

  @Column({ nullable: true, type: 'text' })
  coverLetter?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({ nullable: true })
  reviewedAt?: Date;

  @CreateDateColumn()
  appliedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
