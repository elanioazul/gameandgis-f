/*
Fuente:
https://angularfrontenders.com/mapper-en-typescript/
*/
interface IMapperGeneric<Source, Target> {
	transform(entity: Source): Target;
	transform(array: Source[]): Target[];
	transform(entityOrArray: Source | Source[]): Target | Target[];
}

export abstract class MapperGeneric<Source, Target>
	implements IMapperGeneric<Source, Target>
{
	transform(entity: Source): Target;
	transform(array: Source[]): Target[];
	transform(entityOrArray: Source | Source[]): Target | Target[] {
		return Array.isArray(entityOrArray)
			? entityOrArray.map((item: Source) => this.map(item))
			: this.map(entityOrArray);
	}
	protected abstract map(entity: Source): Target;
}
