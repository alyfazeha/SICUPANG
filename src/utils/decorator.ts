import "reflect-metadata";

const INTERFACE_METADATA_KEY = Symbol("interface:schema");

/**
 * @description
 * A utility class providing decorators for capturing and attaching metadata to classes.
 */
class Decorator {
  /**
   * @description
   * Dekorator untuk menangkap tipe properti pada saat desain (design-time types)
   * menggunakan `reflect-metadata`, lalu menyimpannya sebagai metadata pada prototype class.
   *
   * Metadata ini dapat digunakan untuk keperluan runtime, seperti:
   * - Validasi tipe properti
   * - Serialisasi / deserialisasi
   * - Generasi schema (misalnya JSON schema)
   *
   * @typeParam T - Tipe konstruktor class yang akan diberikan dekorator.
   *
   * @param constructor - Konstruktor class target.
   * @returns Konstruktor class yang sama, dengan metadata tambahan pada prototype.
   */
  public static Interface<T extends { new (...args: unknown[]): object }>(constructor: T): T {
    const schema: Record<string, unknown> = {};

    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      if (key === "constructor") continue;
      const type = Reflect.getMetadata("design:type", constructor.prototype, key) as (new (...args: unknown[]) => unknown) | undefined;
      schema[key] = type?.name ?? "unknown";
    }

    Reflect.defineMetadata(INTERFACE_METADATA_KEY, schema, constructor.prototype);
    return constructor;
  }

  /**
   * @param target - Object target yang memiliki metadata interface.
   * @returns Schema interface yang tersimpan pada metadata, atau `undefined` jika tidak ada.
   * @typeParam T - Tipe object target.
   * @description
   * Mengambil schema interface yang telah disimpan pada metadata object target.
   * Schema ini berisi informasi tentang tipe properti yang telah ditangkap oleh dekorator `@Interface`.
   */
  public static getInterfaceSchema(target: object): Record<string, unknown> | undefined {
    return Reflect.getMetadata(INTERFACE_METADATA_KEY, target);
  }
}

export const Interface = Decorator.Interface;
export const getInterfaceSchema = Decorator.getInterfaceSchema;
export { Decorator };