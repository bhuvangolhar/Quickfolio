import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../../config/db.js';

export interface ProfileAttributes {
  id: number;
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  contact_bio?: string | null;
  avatar?: string | null;
  resume?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProfileCreationAttributes = Optional<ProfileAttributes, 'id'>;

export class Profile 
  extends Model<ProfileAttributes, ProfileCreationAttributes> 
  implements ProfileAttributes 
{
  public id!: number;
  public name!: string | null;
  public role!: string | null;
  public bio!: string | null;
  public contact_bio!: string | null;
  public avatar!: string | null;
  public resume!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact_bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Profiles',
  }
);

export default Profile;