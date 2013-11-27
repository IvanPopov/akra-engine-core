// AITriTreeNode interface
// [write description here...]


interface AITriTreeNode {
    baseNeighbor: AITriTreeNode;
    leftNeighbor: AITriTreeNode;
    rightNeighbor: AITriTreeNode;
    leftChild: AITriTreeNode;
    rightChild: AITriTreeNode;
}

interface AITriangleNodePool {
    request(): AITriTreeNode;
    reset(): void;
}


