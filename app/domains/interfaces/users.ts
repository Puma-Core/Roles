import { Token } from "../tokens";

/**
 * Represents the values required to create a user domain model.
 *
 * @public
 */
export interface UserValues {
    /** Unique user identifier. */
    id: number;

    /** Date when the user was created. */
    createdAt: Date;

    /** Date when the user was last updated. */
    updatedAt: Date;

    /** Unique username used to authenticate the user. */
    username: string;

    /** User first name. */
    firstName: string;

    /** User last name. */
    lastName: string;

    /** User password. */
    password: string;

    /** User age. */
    age: number;

    /** Roles assigned to the user. */
    roles: unknown[];

    /** User nationality. */
    nationality: string;

    /** Tokens assigned to the user. */
    tokens?: Token[];
    
}

export interface CreateUserValues extends Omit<UserValues, "id" | "createdAt" | "updatedAt"> {}

/** Credentials required to authenticate a user. */
export interface LoginUserValues {
    /** Username used to authenticate the user. */
    username: string;

    /** Plain password used to authenticate the user. */
    password: string;
}
