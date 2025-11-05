/**
 * 修复重复用户菜单脚本
 * 确保页面上只存在一个用户菜单实例，避免冲突
 */

class UserMenuFixer {
    constructor() {
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.fixDuplicateUserMenus.bind(this));
        } else {
            this.fixDuplicateUserMenus();
        }
    }
    
    fixDuplicateUserMenus() {
        // 检查重复的用户菜单元素
        this.checkAndFixDuplicates('user-menu');
        this.checkAndFixDuplicates('user-dropdown');
        this.checkAndFixDuplicates('auth-buttons');
        
        // 检查移动版菜单的重复
        this.checkAndFixDuplicates('mobile-user-menu');
        this.checkAndFixDuplicates('mobile-auth-buttons');
    }
    
    checkAndFixDuplicates(elementId) {
        // 使用querySelectorAll查找所有具有相同ID的元素
        const elements = document.querySelectorAll(`[id="${elementId}"]`);
        
        if (elements.length > 1) {
            console.log(`发现重复的元素ID: ${elementId}，保留第一个，移除其他`);
            // 保留第一个实例，移除其他实例
            for (let i = 1; i < elements.length; i++) {
                elements[i].remove();
            }
        }
    }
}

// 初始化修复器
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        new UserMenuFixer();
    });
}
