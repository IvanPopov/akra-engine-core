

function TriTreeNode()
{
	this.pBaseNeighbor=null;
	this.pLeftNeighbor=null;
	this.pRightNeighbor=null;
	this.pLeftChild=null;
	this.pRightChild=null;
}
a.TriTreeNode=TriTreeNode;



function TriangleNodePool(iCount)
{
	this.iNextTriNode=0;
	this.iMaxCount=iCount;
	this.pPool=Array(this.iMaxCount);
	console.log("TriangleNodePool",this.iMaxCount);
	for(var i=0;i<this.iMaxCount;i++)
	{
		this.pPool[i]= new a.TriTreeNode();
	}
}

TriangleNodePool.prototype.request=function ()
{
	var pNode=null;

	if(this.iNextTriNode<this.iMaxCount)
	{
		pNode=this.pPool[this.iNextTriNode];
		pNode.pBaseNeighbor=null;
		pNode.pLeftNeighbor=null;
		pNode.pRightNeighbor=null;
		pNode.pLeftChild=null;
		pNode.pRightChild=null;
		this.iNextTriNode++;
	}

	return pNode;
}


TriangleNodePool.prototype.reset=function()
{
	this.iNextTriNode=0;
}

a.TriangleNodePool=TriangleNodePool;