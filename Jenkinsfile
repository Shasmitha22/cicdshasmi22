pipeline {
    agent any

    environment {
        AWS_REGION      = "ap-south-1"
        AWS_ACCOUNT_ID  = "253985439142"
        REPO_NAME       = "myapp"
        IMAGE_TAG       = "${GIT_COMMIT}"
        ECR_URI         = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"

        // EC2 Information
        EC2_HOST        = "13.232.192.0"
        EC2_USER        = "ubuntu"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                docker build -t ${REPO_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_URI}

                    docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
                    docker push ${ECR_URI}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                        echo "Logging into ECR..."
                        aws ecr get-login-password --region ${AWS_REGION} |
                        docker login --username AWS --password-stdin ${ECR_URI}

                        echo "Pulling latest image..."
                        docker pull ${ECR_URI}:${IMAGE_TAG}

                        echo "Stopping old container..."
                        docker stop myapp || true
                        docker rm myapp || true

                        echo "Starting new container..."
                        docker run -d --name myapp -p 3000:3000 ${ECR_URI}:${IMAGE_TAG}

                        echo "Deployment completed!"
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment successful! Visit http://${EC2_HOST}:3000"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}
