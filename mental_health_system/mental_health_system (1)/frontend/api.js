// API服务
const API_URL = 'http://localhost:5000/api/v1';

// 存储认证令牌
let token = localStorage.getItem('token');

// 设置认证令牌
export const setAuthToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

// 清除认证令牌
export const clearAuthToken = () => {
  token = null;
  localStorage.removeItem('token');
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  return !!token;
};

// 获取认证信息
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 用户登录
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 用户注册
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 用户登出
export const logout = () => {
  clearAuthToken();
};

// 更新用户详情
export const updateUserDetails = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/updatedetails`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update user details');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 更新密码
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/users/updatepassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取所有测评
export const getAssessments = async () => {
  try {
    const response = await fetch(`${API_URL}/assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get assessments');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取单个测评
export const getAssessment = async (id) => {
  try {
    const response = await fetch(`${API_URL}/assessments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get assessment');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 提交测评结果
export const submitAssessment = async (id, answers) => {
  try {
    const response = await fetch(`${API_URL}/assessments/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取用户测评记录
export const getUserAssessmentRecords = async () => {
  try {
    const response = await fetch(`${API_URL}/assessments/records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get assessment records');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取用户特定测评记录
export const getAssessmentRecord = async (id) => {
  try {
    const response = await fetch(`${API_URL}/assessments/${id}/record`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get assessment record');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取所有咨询师
export const getConsultants = async () => {
  try {
    const response = await fetch(`${API_URL}/consultants`, {
      method: 'GET',
      headers: {
        'Content-Type-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get consultants');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取单个咨询师
export const getConsultant = async (id) => {
  try {
    const response = await fetch(`${API_URL}/consultants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get consultant');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取咨询师可用性
export const getConsultantAvailability = async (id) => {
  try {
    const response = await fetch(`${API_URL}/consultants/${id}/availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get consultant availability');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 创建预约
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取用户预约
export const getUserBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get bookings');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取单个预约
export const getBooking = async (id) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get booking');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 更新预约状态
export const updateBookingStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 取消预约
export const cancelBooking = async (id) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取所有活动
export const getActivities = async () => {
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get activities');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取单个活动
export const getActivity = async (id) => {
  try {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get activity');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 活动报名
export const registerActivity = async (id, registrationData) => {
  try {
    const response = await fetch(`${API_URL}/activities/${id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      throw new Error('Failed to register for activity');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 获取用户活动报名
export const getUserActivityRegistrations = async () => {
  try {
    const response = await fetch(`${API_URL}/activities/registrations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get activity registrations');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 取消活动报名
export const cancelActivityRegistration = async (activityId, registrationId) => {
  try {
    const response = await fetch(`${API_URL}/activities/${activityId}/registrations/${registrationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel activity registration');
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ---------------------------
// 心理实验相关API
// ---------------------------

// 保存实验结果
export const saveExperimentResult = async (experimentType, results) => {
  try {
    const response = await fetch(`${API_URL}/experiments/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        experimentType, 
        results,
        timestamp: new Date().toISOString() 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save experiment result');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('保存实验结果失败:', error);
    throw error;
  }
};

// 获取用户实验记录
export const getUserExperimentRecords = async () => {
  try {
    const response = await fetch(`${API_URL}/experiments/records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get experiment records');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取实验记录失败:', error);
    throw error;
  }
};

// 获取单个实验记录
export const getExperimentRecord = async (id) => {
  try {
    const response = await fetch(`${API_URL}/experiments/records/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get experiment record');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取单个实验记录失败:', error);
    throw error;
  }
};

// 获取所有可用实验
export const getAvailableExperiments = async () => {
  try {
    const response = await fetch(`${API_URL}/experiments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get available experiments');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取可用实验失败:', error);
    throw error;
  }
};

// 获取实验统计数据（用于结果对比）
export const getExperimentStats = async (experimentType) => {
  try {
    const response = await fetch(`${API_URL}/experiments/stats/${experimentType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get experiment stats');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取实验统计数据失败:', error);
    // 如果获取统计数据失败，返回默认数据以便前端展示
    return getDefaultExperimentStats(experimentType);
  }
};

// 获取默认实验统计数据（作为备份）
const getDefaultExperimentStats = (experimentType) => {
  const defaultStats = {
    stroop: {
      congruentAvg: 550,  // 毫秒
      incongruentAvg: 720, // 毫秒
      conflictEffectAvg: 170 // 毫秒
    },
    'memory-span': {
      averageSpan: 7.0,
      standardDeviation: 1.5
    },
    'visual-search': {
      targetPresentAvg: 600,
      targetAbsentAvg: 800
    },
    'emotion-recognition': {
      averageAccuracy: 75
    },
    'affective-priming': {
      primingEffectAvg: 0.5
    },
    'asch-conformity': {
      averageConformityRate: 37
    },
    'prisoners-dilemma': {
      cooperationRateAvg: 55
    },
    iat: {
      averageBiasScore: 0.3
    }
  };
  
  return defaultStats[experimentType] || {};
};

// 本地存储管理函数（用于未登录用户）
export const saveExperimentResultToLocal = (experimentType, results) => {
  try {
    // 获取现有记录
    let experimentRecords = JSON.parse(localStorage.getItem('experimentRecords') || '[]');
    
    // 添加新记录
    experimentRecords.push({
      type: experimentType,
      results: results,
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近20条记录
    if (experimentRecords.length > 20) {
      experimentRecords = experimentRecords.slice(-20);
    }
    
    // 保存回localStorage
    localStorage.setItem('experimentRecords', JSON.stringify(experimentRecords));
    
    return true;
  } catch (error) {
    console.error('保存实验结果到localStorage失败:', error);
    return false;
  }
};

// 从本地存储获取实验记录
export const getExperimentResultsFromLocal = (experimentType = null) => {
  try {
    const experimentRecords = JSON.parse(localStorage.getItem('experimentRecords') || '[]');
    
    if (experimentType) {
      return experimentRecords.filter(record => record.type === experimentType);
    }
    
    return experimentRecords;
  } catch (error) {
    console.error('从localStorage获取实验记录失败:', error);
    return [];
  }
};
