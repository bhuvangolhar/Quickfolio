import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import sequelize from '../../config/db.js';

export class Certification extends Model<
  InferAttributes<Certification>,
  InferCreationAttributes<Certification>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare provider: string;
  declare year: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare tools: CreationOptional<string | null>;
  declare credential_url: CreationOptional<string | null>;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Certification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tools: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credential_url: {
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
    tableName: 'Certifications',
  }
);

export default Certification;