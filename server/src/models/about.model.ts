import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import sequelize from '../../config/db.js';

export class About extends Model<
  InferAttributes<About>,
  InferCreationAttributes<About>
> {
  declare id: CreationOptional<number>;
  declare section: CreationOptional<string>;
  declare heading: string;
  declare subtitle: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare code_filename: CreationOptional<string>;
  declare code_content: CreationOptional<string | null>;
  declare stat1_value: CreationOptional<string | null>;
  declare stat1_label: CreationOptional<string | null>;
  declare stat2_value: CreationOptional<string | null>;
  declare stat2_label: CreationOptional<string | null>;
  declare stat3_value: CreationOptional<string | null>;
  declare stat3_label: CreationOptional<string | null>;
  declare stat4_value: CreationOptional<string | null>;
  declare stat4_label: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

About.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: DataTypes.STRING(100),
      defaultValue: '01 - ABOUT',
    },
    heading: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    code_filename: {
      type: DataTypes.STRING(100),
      defaultValue: 'config.json',
    },
    code_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stat1_value: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    stat1_label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stat2_value: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    stat2_label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stat3_value: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    stat3_label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stat4_value: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    stat4_label: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    tableName: 'Abouts',
  }
);

export default About;