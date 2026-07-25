import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('governorates')
export class Governorate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;

  @Column({ nullable: true })
  populationEstimate?: number;
}

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  governorateId!: string;

  @ManyToOne(() => Governorate)
  @JoinColumn({ name: 'governorateId' })
  governorate!: Governorate;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;
}

@Entity('neighborhoods')
export class Neighborhood {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  districtId!: string;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
  district!: District;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;
}
