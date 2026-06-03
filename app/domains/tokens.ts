import { TokenValues } from "./interfaces/tokens";

/**
 * Represents a token domain model.
 *
 * @public
 */
export class Token {
    /** Unique token identifier. */
    public id: number;

    /** Token name used to identify its purpose. */
    public name: string;

    /** Token value. */
    public value: string;

    /** Date when the token was created. */
    public createdAt: Date;

    /** Date when the token expires. */
    public expireAt: Date;

    /** User identifier associated with the token. */
    public userId: number;

    /**
     * Creates a token domain model.
     *
     * @param values - Values used to initialize the token.
     */
    public constructor(values: TokenValues) {
        this.id = values.id;
        this.name = values.name;
        this.value = values.value;
        this.createdAt = values.createdAt;
        this.expireAt = values.expireAt;
        this.userId = values.userId;
    }
}
