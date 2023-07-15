export default abstract class Stream
{
	protected position: number = 0;

	getPosition(): number
	{
		return this.position;
	}
}