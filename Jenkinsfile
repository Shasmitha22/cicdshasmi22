pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "<YOUR_AWS_ACCOUNT_ID>"
        REPO_NAME = "myapp"
        IMAGE_TAG = "${env.GIT_COMMIT}"
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build App') {
            steps {
                sh "npm install"
                sh "npm test"
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${REPO_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin ${ECR_URI}
                """
            }
        }

        stage('Push Image') {
            steps {
                sh """
                docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
                docker push ${ECR_URI}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
