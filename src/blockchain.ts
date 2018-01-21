class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: string;

  constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }

  const blockChain: Block[] = [genesisBlock];

  const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    CrytoJS.SHA256(index + previousHash + timestamp + data).toString();

  const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'Genesis block'
  );

  const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimeStamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData);
    return newBlock;
  }

  const isValidNewBlock = (newBlock: Block, previousBlock: Block) => {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('Invalid index');
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('Invalid previous hash');
      return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
      console.log('Invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
      return false;
    }
    return true;
  }

  const isValidBlockStructure = (block:Block): boolean => {
    return   typeof block.index === 'number'
          && typeof block.hash === 'string'
          && typeof block.previousHash === 'string'
          && typeof block.timestamp === 'number'
          && typeof block.data === 'string';
  }

  const isValidChain = (blockChainToValidate: Block[]): boolean => {
    const isValidGenesis = (block:Block): boolean => {
      return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if(!isValidGenesis(blockChainToValidate[0])) {
      return false;
    }

    for(let i = 1 ; i < blockChainToValidate.length ; i++) {
      if(!isValidNewBlock(blockChainToValidate[i], blockChainToValidate[i-1])) {
        return false;
      }
    }

    return true;
  };

  const replaceChain = (newBlocks: Block[]) => {
    if(isValidChain(newBlocks) && newBlocks.length > getBlockChain().length) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
      blockChain = newBlocks;
      broadcastLatest();
    }
  };
}
