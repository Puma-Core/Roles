/**
 * Represents the values required to create a token domain model.
 *
 * @public
 */
export interface TokenValues {
    /** Unique token identifier. */
    id: number;

    /** Token name used to identify its purpose. */
    name: string;

    /** Token value. */
    value: string;

    /** Date when the token was created. */
    createdAt: Date;

    /** Date when the token expires. */
    expireAt: Date;

    /** User identifier associated with the token. */
    userId: number;
}

export interface CreateTokenValues extends Omit<TokenValues, "id" | "createdAt"> {}
