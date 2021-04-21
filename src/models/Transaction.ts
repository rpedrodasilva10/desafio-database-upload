import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column({
    type: 'numeric',
    scale: 2,
  })
  value: number;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  //@ManyToMany(type => Question, question => question.categories)
  //questions: Question[];
  @ManyToOne(() => Category, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

export default Transaction;
