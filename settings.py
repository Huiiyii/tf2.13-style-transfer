# -*- coding: utf-8 -*-
# @File    : settings.py
# @Author  : AaronJny
# @Time    : 2020/03/13
# @Desc    :


# 内容特征层及loss加权系数
CONTENT_LAYERS = {'block4_conv2': 0.5, 'block5_conv2': 0.5}
# 风格特征层及loss加权系数
STYLE_LAYERS = {'block1_conv1': 0.2, 'block2_conv1': 0.2, 'block3_conv1': 0.2, 'block4_conv1': 0.2,
                'block5_conv1': 0.2}
# 内容图片路径
# 生成图片的保存目录
# CONTENT_IMAGE_PATH = './images/touxiang.jpg'
# OUTPUT_DIR = './output1'
# CONTENT_IMAGE_PATH = './images/school1.jpg'
# OUTPUT_DIR = './output2'
# CONTENT_IMAGE_PATH = './images/school2.jpg'
# OUTPUT_DIR = './output3'
# CONTENT_IMAGE_PATH = './images/zxb.jpg'
# OUTPUT_DIR = './output4'
CONTENT_IMAGE_PATH = './images/school2.jpg'
OUTPUT_DIR = './output7'

# 风格图片路径
STYLE_IMAGE_PATH = './images/style3.jpg'

# 内容loss总加权系数
CONTENT_LOSS_FACTOR = 1
# 风格loss总加权系数
STYLE_LOSS_FACTOR = 100

# 图片宽度
WIDTH = 450
# 图片高度
HEIGHT = 300

# 训练epoch数
EPOCHS = 20
# 每个epoch训练多少次
STEPS_PER_EPOCH = 100
# 学习率
LEARNING_RATE = 0.03
