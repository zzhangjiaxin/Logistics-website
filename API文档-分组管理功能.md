# API 文档 - 分组管理和轮播图功能

## 📋 概述

本文档详细描述了轮播图分组管理和批量操作相关的 API 接口。

**基础信息**:
- **Base URL**: `http://localhost:8080/api`
- **认证方式**: Header 中传递 `X-Tenant-Id`
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 🔐 认证说明

所有 API 请求都需要在 Header 中包含租户 ID：

```http
X-Tenant-Id: 1
```

---

## 📦 轮播图分组 API

### 1. 获取所有分组列表

**接口地址**: `GET /tenant/carousel-group/list`

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/list
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupKey": "home",
      "groupName": "首页",
      "description": "首页轮播图",
      "sortOrder": 1,
      "isEnabled": 1,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    {
      "id": 2,
      "tenantId": 1,
      "groupKey": "product",
      "groupName": "产品中心",
      "description": "产品展示页面",
      "sortOrder": 3,
      "isEnabled": 0,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-02T15:30:00"
    }
  ]
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 分组ID |
| tenantId | Long | 租户ID |
| groupKey | String | 分组标识（英文，用于系统内部引用） |
| groupName | String | 分组名称（中文，显示给用户） |
| description | String | 分组描述 |
| sortOrder | Integer | 排序顺序（数字越小越靠前） |
| isEnabled | Integer | 是否启用（0=禁用，1=启用） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

---

### 2. 获取启用的分组列表

**接口地址**: `GET /tenant/carousel-group/enabled`

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/enabled
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupKey": "home",
      "groupName": "首页",
      "description": "首页轮播图",
      "sortOrder": 1,
      "isEnabled": 1,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

**说明**: 只返回 `isEnabled = 1` 的分组

---

### 3. 根据ID获取分组详情

**接口地址**: `GET /tenant/carousel-group/{id}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| id | Path | Long | 是 | 分组ID |

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/1
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "tenantId": 1,
    "groupKey": "home",
    "groupName": "首页",
    "description": "首页轮播图",
    "sortOrder": 1,
    "isEnabled": 1,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "分组不存在",
  "data": null
}
```

---

### 4. 创建分组

**接口地址**: `POST /tenant/carousel-group`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| groupKey | String | 是 | 分组标识（英文，唯一） |
| groupName | String | 是 | 分组名称（中文） |
| description | String | 否 | 分组描述 |
| sortOrder | Integer | 否 | 排序顺序（默认自动生成） |
| isEnabled | Integer | 否 | 是否启用（默认1） |

**请求示例**:
```bash
curl -X POST \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupKey": "promotion",
    "groupName": "促销活动",
    "description": "促销活动轮播图",
    "sortOrder": 10,
    "isEnabled": 1
  }' \
  http://localhost:8080/api/tenant/carousel-group
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 8,
    "tenantId": 1,
    "groupKey": "promotion",
    "groupName": "促销活动",
    "description": "促销活动轮播图",
    "sortOrder": 10,
    "isEnabled": 1,
    "createdAt": "2024-01-03T14:20:00",
    "updatedAt": "2024-01-03T14:20:00"
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "分组标识已存在",
  "data": null
}
```

---

### 5. 更新分组

**接口地址**: `PUT /tenant/carousel-group/{id}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| id | Path | Long | 是 | 分组ID |
| groupKey | Body | String | 是 | 分组标识 |
| groupName | Body | String | 是 | 分组名称 |
| description | Body | String | 否 | 分组描述 |
| sortOrder | Body | Integer | 是 | 排序顺序 |
| isEnabled | Body | Integer | 是 | 是否启用 |

**请求示例**:
```bash
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupKey": "product",
    "groupName": "产品中心",
    "description": "产品展示页面（已更新）",
    "sortOrder": 3,
    "isEnabled": 0
  }' \
  http://localhost:8080/api/tenant/carousel-group/2
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "tenantId": 1,
    "groupKey": "product",
    "groupName": "产品中心",
    "description": "产品展示页面（已更新）",
    "sortOrder": 3,
    "isEnabled": 0,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-03T14:25:00"
  }
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "分组不存在",
  "data": null
}
```

---

### 6. 删除分组

**接口地址**: `DELETE /tenant/carousel-group/{id}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| id | Path | Long | 是 | 分组ID |

**请求示例**:
```bash
curl -X DELETE \
  -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/8
```

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "该分组下还有轮播图，无法删除",
  "data": null
}
```

**注意事项**:
- 删除分组前需要先删除或移动该分组下的所有轮播图
- 删除操作不可恢复，请谨慎操作

---

## 🎨 轮播图 API

### 7. 获取所有轮播图列表

**接口地址**: `GET /tenant/carousel/list`

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/list
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupName": "home",
      "title": "首页轮播图1",
      "imageUrl": "/uploads/1/uploadfiles/banner1.jpg",
      "linkUrl": "/business",
      "sortOrder": 1,
      "isEnabled": 1,
      "target": "_self",
      "description": "首页主轮播图",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    {
      "id": 2,
      "tenantId": 1,
      "groupName": "product",
      "title": "产品轮播图1",
      "imageUrl": "/uploads/1/uploadfiles/product1.jpg",
      "linkUrl": "/product/detail/1",
      "sortOrder": 1,
      "isEnabled": 0,
      "target": "_blank",
      "description": "产品展示轮播图",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-02T15:30:00"
    }
  ]
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 轮播图ID |
| tenantId | Long | 租户ID |
| groupName | String | 分组标识 |
| title | String | 轮播图标题 |
| imageUrl | String | 图片URL |
| linkUrl | String | 点击跳转链接 |
| sortOrder | Integer | 排序顺序 |
| isEnabled | Integer | 是否启用（0=禁用，1=启用） |
| target | String | 打开方式（_self=当前窗口，_blank=新窗口） |
| description | String | 轮播图描述 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

---

### 8. 获取启用的轮播图列表

**接口地址**: `GET /tenant/carousel/enabled`

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/enabled
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupName": "home",
      "title": "首页轮播图1",
      "imageUrl": "/uploads/1/uploadfiles/banner1.jpg",
      "linkUrl": "/business",
      "sortOrder": 1,
      "isEnabled": 1,
      "target": "_self",
      "description": "首页主轮播图",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

**说明**: 只返回 `isEnabled = 1` 的轮播图，用于前端展示

---

### 9. 根据分组获取轮播图列表

**接口地址**: `GET /tenant/carousel/group/{groupName}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| groupName | Path | String | 是 | 分组标识 |

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/home
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupName": "home",
      "title": "首页轮播图1",
      "imageUrl": "/uploads/1/uploadfiles/banner1.jpg",
      "linkUrl": "/business",
      "sortOrder": 1,
      "isEnabled": 1,
      "target": "_self",
      "description": "首页主轮播图",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

---

### 10. 根据分组获取启用的轮播图列表

**接口地址**: `GET /tenant/carousel/group/{groupName}/enabled`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| groupName | Path | String | 是 | 分组标识 |

**请求示例**:
```bash
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/home/enabled
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "tenantId": 1,
      "groupName": "home",
      "title": "首页轮播图1",
      "imageUrl": "/uploads/1/uploadfiles/banner1.jpg",
      "linkUrl": "/business",
      "sortOrder": 1,
      "isEnabled": 1,
      "target": "_self",
      "description": "首页主轮播图",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

**说明**: 只返回指定分组下 `isEnabled = 1` 的轮播图

---

### 11. 批量禁用分组下的所有轮播图 ⭐

**接口地址**: `PUT /tenant/carousel/group/{groupName}/disable`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| groupName | Path | String | 是 | 分组标识 |

**请求示例**:
```bash
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/product/disable
```

**响应示例**:
```json
{
  "code": 200,
  "message": "成功禁用 5 张轮播图",
  "data": null
}
```

**功能说明**:
- 将指定分组下的所有轮播图状态设置为禁用（`isEnabled = 0`）
- 返回成功禁用的轮播图数量
- 常用于"禁用分组并关闭所有轮播图"场景

**使用场景**:
1. 批量下线整个分组的轮播图
2. 活动结束后批量关闭促销轮播图
3. 临时关闭某个页面的所有轮播图

**错误响应**:
```json
{
  "code": 500,
  "message": "批量禁用失败：数据库连接错误",
  "data": null
}
```

---

### 12. 创建轮播图

**接口地址**: `POST /tenant/carousel`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| groupName | String | 是 | 分组标识 |
| title | String | 是 | 轮播图标题 |
| imageUrl | String | 是 | 图片URL |
| linkUrl | String | 否 | 点击跳转链接 |
| sortOrder | Integer | 否 | 排序顺序（默认自动生成） |
| isEnabled | Integer | 否 | 是否启用（默认1） |
| target | String | 否 | 打开方式（默认_self） |
| description | String | 否 | 轮播图描述 |

**请求示例**:
```bash
curl -X POST \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "home",
    "title": "新年促销",
    "imageUrl": "/uploads/1/uploadfiles/newyear.jpg",
    "linkUrl": "/promotion/newyear",
    "sortOrder": 1,
    "isEnabled": 1,
    "target": "_blank",
    "description": "新年促销活动轮播图"
  }' \
  http://localhost:8080/api/tenant/carousel
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 10,
    "tenantId": 1,
    "groupName": "home",
    "title": "新年促销",
    "imageUrl": "/uploads/1/uploadfiles/newyear.jpg",
    "linkUrl": "/promotion/newyear",
    "sortOrder": 1,
    "isEnabled": 1,
    "target": "_blank",
    "description": "新年促销活动轮播图",
    "createdAt": "2024-01-03T14:30:00",
    "updatedAt": "2024-01-03T14:30:00"
  }
}
```

---

### 13. 更新轮播图

**接口地址**: `PUT /tenant/carousel/{id}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| id | Path | Long | 是 | 轮播图ID |
| groupName | Body | String | 是 | 分组标识 |
| title | Body | String | 是 | 轮播图标题 |
| imageUrl | Body | String | 是 | 图片URL |
| linkUrl | Body | String | 否 | 点击跳转链接 |
| sortOrder | Body | Integer | 是 | 排序顺序 |
| isEnabled | Body | Integer | 是 | 是否启用 |
| target | Body | String | 是 | 打开方式 |
| description | Body | String | 否 | 轮播图描述 |

**请求示例**:
```bash
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "home",
    "title": "新年促销（已更新）",
    "imageUrl": "/uploads/1/uploadfiles/newyear_v2.jpg",
    "linkUrl": "/promotion/newyear",
    "sortOrder": 1,
    "isEnabled": 1,
    "target": "_blank",
    "description": "新年促销活动轮播图（已更新）"
  }' \
  http://localhost:8080/api/tenant/carousel/10
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 10,
    "tenantId": 1,
    "groupName": "home",
    "title": "新年促销（已更新）",
    "imageUrl": "/uploads/1/uploadfiles/newyear_v2.jpg",
    "linkUrl": "/promotion/newyear",
    "sortOrder": 1,
    "isEnabled": 1,
    "target": "_blank",
    "description": "新年促销活动轮播图（已更新）",
    "createdAt": "2024-01-03T14:30:00",
    "updatedAt": "2024-01-03T14:35:00"
  }
}
```

---

### 14. 删除轮播图

**接口地址**: `DELETE /tenant/carousel/{id}`

**请求参数**:
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| id | Path | Long | 是 | 轮播图ID |

**请求示例**:
```bash
curl -X DELETE \
  -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/10
```

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "轮播图不存在",
  "data": null
}
```

---

## 🔄 业务流程示例

### 场景 1: 仅禁用分组（轮播图不受影响）

```bash
# 1. 更新分组状态为禁用
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupKey": "product",
    "groupName": "产品中心",
    "description": "产品展示页面",
    "sortOrder": 3,
    "isEnabled": 0
  }' \
  http://localhost:8080/api/tenant/carousel-group/2

# 2. 验证分组已禁用
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/2

# 3. 验证轮播图状态未变
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/product
```

---

### 场景 2: 禁用分组并关闭所有轮播图

```bash
# 1. 更新分组状态为禁用
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupKey": "product",
    "groupName": "产品中心",
    "description": "产品展示页面",
    "sortOrder": 3,
    "isEnabled": 0
  }' \
  http://localhost:8080/api/tenant/carousel-group/2

# 2. 批量禁用该分组下的所有轮播图
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/product/disable

# 3. 验证分组已禁用
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/2

# 4. 验证轮播图已全部禁用
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel/group/product
```

---

### 场景 3: 启用已禁用的分组

```bash
# 1. 更新分组状态为启用
curl -X PUT \
  -H "X-Tenant-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "groupKey": "product",
    "groupName": "产品中心",
    "description": "产品展示页面",
    "sortOrder": 3,
    "isEnabled": 1
  }' \
  http://localhost:8080/api/tenant/carousel-group/2

# 2. 验证分组已启用
curl -H "X-Tenant-Id: 1" \
  http://localhost:8080/api/tenant/carousel-group/2

# 注意：启用分组不会自动启用轮播图，需要手动启用
```

---

## ⚠️ 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 操作成功 | - |
| 400 | 请求参数错误 | 检查请求参数是否正确 |
| 401 | 未授权 | 检查 X-Tenant-Id 是否正确 |
| 404 | 资源不存在 | 检查资源ID是否正确 |
| 500 | 服务器内部错误 | 查看后端日志，联系技术支持 |

---

## 📝 注意事项

1. **租户隔离**: 所有接口都需要传递 `X-Tenant-Id`，确保数据隔离
2. **分组标识唯一性**: `groupKey` 在同一租户下必须唯一
3. **禁用分组**: 禁用分组不会自动禁用轮播图，需要调用批量禁用接口
4. **启用分组**: 启用分组不会自动启用轮播图，需要手动启用
5. **删除分组**: 删除分组前需要先删除或移动该分组下的所有轮播图
6. **排序顺序**: `sortOrder` 数字越小越靠前
7. **图片URL**: 支持相对路径和绝对路径
8. **链接URL**: 支持内部链接和外部链接

---

## 🚀 Postman 集合

可以导入以下 Postman 集合进行测试：

```json
{
  "info": {
    "name": "轮播图分组管理 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "获取所有分组",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-Tenant-Id",
            "value": "1"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/tenant/carousel-group/list",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "tenant", "carousel-group", "list"]
        }
      }
    },
    {
      "name": "批量禁用轮播图",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "X-Tenant-Id",
            "value": "1"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/tenant/carousel/group/product/disable",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "tenant", "carousel", "group", "product", "disable"]
        }
      }
    }
  ]
}
```

---

## 📞 技术支持

如有问题，请联系技术支持团队。
