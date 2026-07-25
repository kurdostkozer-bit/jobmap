import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyId!: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax?: number;

  @Column({ default: 'JOD' })
  salaryCurrency!: string;

  @Column()
  governorate!: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  realLatitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  realLongitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  anonymizedLatitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  anonymizedLongitude!: number;

  @Column({ type: 'simple-array', default: '' })
  skills!: string[];

  @Column({ type: 'simple-array', default: '' })
  languages!: string[];

  @Column({ default: 'Full-Time' })
  jobType!: string; // Full-Time, Part-Time, Contract, Internship

  @Column({ default: 'Entry' })
  experienceLevel!: string; // Entry, Mid, Senior, Executive

  @Column({ default: 0 })
  applicantsCount!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  expiresAt?: Date;
}
