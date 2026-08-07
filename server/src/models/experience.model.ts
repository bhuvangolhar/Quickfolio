import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import sequelize from '../../config/db.js';

export class Experience extends Model<
  InferAttributes<Experience>,
  InferCreationAttributes<Experience>
> {
  declare id: CreationOptional<number>;
  declare date_range: CreationOptional<string | null>;
  declare role: string;
  declare company: CreationOptional<string | null>;
  declare location: CreationOptional<string | null>;
  declare view: CreationOptional<string | null>;
  declare tech_stack: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Experience.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_range: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    view: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    tech_stack: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'Experiences',
  }
);

export default Experience;