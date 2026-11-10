export type Friend = {
	name: string;
	url: string;
	description: string;
	/** 可选头像：完整 URL、public 目录路径（以 / 开头），或相对 src 的路径。 */
	avatar?: string;
};

// 友链统一在此配置，无需修改页面。按数组顺序显示，留空时展示空状态。
// 添加示例（复制到下面的数组中）：
// {
// 	name: "朋友的博客",
// 	url: "https://example.com/",
// 	description: "记录生活与灵感",
// 	avatar: "/avatar.png", // 可选，对应 public/avatar.png
// },
export const friends: Friend[] = [
{
  name: "LIPiston",
  url: "https://lipiston.top/",
  description: "「做一件价值观上认为正确的事」",
  avatar: "https://lipiston.top/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F75552696%3Fs%3D400%26u%3D3568621cf2d05305e0a4c959cac1b949384131fa%26v%3D4&w=256&q=75"
}


];
