import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import sequelize from '../../config/db.js';

export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<number>;
  declare year: CreationOptional<string | null>;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare techStack: CreationOptional<string | null>;
  declare media_type: CreationOptional<string | null>;
  declare media_url: CreationOptional<string | null>;
  declare github: CreationOptional<string | null>;
  declare live: CreationOptional<string | null>;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    techStack: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    media_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    github: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    live: {
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
    tableName: 'Projects',
  }
);

export default Project;