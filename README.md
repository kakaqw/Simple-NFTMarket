## 快速开始

### 1. 安装依赖

```bash
# 安装智能合约依赖
cd contract
forge install

# 安装后端依赖
cd ../backend
npm install

# 安装前端依赖
cd ../web
npm install
```

### 2. 启动服务

```bash
# 启动后端服务 (端口: 3001)
cd backend
npm start

# 启动前端服务 (端口: 3000)
cd ../web
npm run dev
```

### 3. 部署智能合约

```bash
cd contract
forge build
forge deploy
```

## 技术栈

- **智能合约**: Solidity, Foundry
- **后端**: Node.js, Express.js, MongoDB
- **前端**: Next.js, React, TypeScript, Tailwind CSS
- **区块链**: Ethereum, wagmi, viem

## 功能特性

- NFT 铸造和交易
- 上架和下架 NFT
- 价格修改
- 钱包连接

EOF
