/**
 * Represents the values required to create a user domain model.
 *
 * @public
 */
export interface UserValues {
    /** Unique user identifier. */
    id: string;

    /** Date when the user was created. */
    createdAt: Date;

    /** Date when the user was last updated. */
    updatedAt: Date;

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
}