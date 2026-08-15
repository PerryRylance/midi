export default abstract class Probeable
{
    probe(condition?: Function)
	{
		if(condition && condition()) debugger;

		return this;
	}
}
