/**
 * Represents a user domain model.
 *
 * @public
 */
import { UserValues } from "./interfaces/users";

export class User {
    /** Unique user identifier. */
    public id: number;

    /** Date when the user was created. */
    public createdAt: Date;

    /** Date when the user was last updated. */
    public updatedAt: Date;

    /** User first name. */
    public firstName: string;

    /** User last name. */
    public lastName: string;

    /** User password. */
    public password: string;

    /** User age. */
    public age: number;

    /** Roles assigned to the user. */
    public roles: unknown[];

    /** User nationality. */
    public nationality: string;

    /**
     * Creates a user domain model.
     *
     * @param values - Values used to initialize the user.
     */
    public constructor(values: UserValues) {
        this.id = values.id;
        this.createdAt = values.createdAt;
        this.updatedAt = values.updatedAt;
        this.firstName = values.firstName;
        this.lastName = values.lastName;
        this.password = values.password;
        this.age = values.age;
        this.roles = values.roles;
        this.nationality = values.nationality;
    }
}
